/**
 * IMPORTANT:
 * ---------
 * Do not manually edit this file if you'd like to use Colyseus Arena
 *
 * If you're self-hosting (without Arena), you can manually instantiate a
 * Colyseus Server as documented here: 👉 https://docs.colyseus.io/server/api/#constructor-options
 */


import { listen } from "@colyseus/tools";

// Import arena config
import app from "./app.config";

// Create and listen on 2567 (or PORT environment variable.)
listen(app);
