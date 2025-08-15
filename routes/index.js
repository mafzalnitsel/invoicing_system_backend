// routes/index.js
import { Router } from "express";
import customers from "./customers.js";
import contactPersons from "./contactPersons.js";
import branches from "./branches.js";
import salesEmployees from "./salesEmployees.js";
import owners from "./owners.js";
import items from "./items.js";
import tax from "./tax.js";
import warehouses from "./warehouses.js";
import costCentres from "./costCentres.js";
import chartOfAccounts from "./chartOfAccounts.js";
import invoices from "./invoices.js";
import auth from "./auth.js";

const router = Router();

router.use("/customers", customers);
router.use("/contact-persons", contactPersons);
router.use("/branches", branches);
router.use("/sales-employees", salesEmployees);
router.use("/owners", owners);
router.use("/items", items);
router.use("/tax", tax);
router.use("/warehouses", warehouses);
router.use("/cost-centres", costCentres);
router.use("/chart-of-accounts", chartOfAccounts);
router.use("/invoices", invoices);
router.use("/auth", auth);

export default router;
