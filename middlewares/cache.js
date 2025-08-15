// middlewares/cache.js
import apicache from "apicache";
const cache = apicache.middleware;

export default cache("5 minutes");
