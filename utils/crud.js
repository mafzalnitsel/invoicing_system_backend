// utils/generateCRUD.js
export function generateCRUD(Model) {
  return {
    // CREATE
    async create(req, res) {
      try {
        const doc = await Model.create(req.body);
        res.status(201).json(doc);
      } catch (error) {
        console.error("Create error:", error);
        res.status(500).json({
          message: "Server error while creating",
          error: error.message,
        });
      }
    },

    // READ ALL (with optional pagination)
    async readAll(req, res) {
      try {
        let { page, per_page, select, ...filters } = req.query;
        page = parseInt(page, 10) || null;
        per_page = parseInt(per_page, 10) || null;

        // Validate and parse select fields
        let projection = null;
        if (select) {
          const requestedFields = select
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean);

          // Allowed fields from schema
          const allowedFields = Object.keys(Model.schema.paths);
          const invalidFields = requestedFields.filter(
            (f) => !allowedFields.includes(f)
          );

          if (invalidFields.length > 0) {
            return res.status(400).json({
              message: `Invalid select field(s): ${invalidFields.join(", ")}`,
              allowedFields,
            });
          }

          projection = requestedFields.join(" "); // mongoose projection format
        }

        let query = Model.find(filters, projection);

        if (page && per_page) {
          const skip = (page - 1) * per_page;
          let total = await Model.countDocuments(filters);

          // If no results found with filters → fallback to all
          if (total === 0) {
            filters = {};
            query = Model.find({}, projection);
            total = await Model.countDocuments({});
          }

          const totalPages = Math.ceil(total / per_page);
          const docs = await query.skip(skip).limit(per_page).exec();

          return res.json({
            data: docs,
            pagination: {
              total,
              totalPages,
              currentPage: page,
              perPage: per_page,
            },
          });
        }

        // Non-paginated
        let docs = await query.exec();
        if (docs.length === 0) {
          docs = await Model.find({}, projection).exec();
        }

        res.json(docs);
      } catch (error) {
        console.error("ReadAll error:", error);
        res.status(500).json({
          message: "Server error while fetching all",
          error: error.message,
        });
      }
    },
    // READ ONE
    async readOne(req, res) {
      try {
        const doc = await Model.findById(req.params.id);
        if (!doc) {
          return res.status(404).json({ message: "Not found" });
        }
        res.json(doc);
      } catch (error) {
        console.error("ReadOne error:", error);
        res.status(500).json({
          message: "Server error while fetching single record",
          error: error.message,
        });
      }
    },

    // UPDATE
    async update(req, res) {
      try {
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!doc) {
          return res.status(404).json({ message: "Not found" });
        }

        res.json(doc);
      } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
          message: "Server error while updating",
          error: error.message,
        });
      }
    },

    // DELETE
    async remove(req, res) {
      try {
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
          return res.status(404).json({ message: "Not found" });
        }

        res.json({ message: "Deleted successfully" });
      } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({
          message: "Server error while deleting",
          error: error.message,
        });
      }
    },
  };
}
