const express = require('express');
const router = express.Router();

// Example GET route for this plugin (API - JSON Data)
router.get('/ping', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "Hello from the Example Feature Plugin!",
        timestamp: new Date().toISOString()
    });
});

// Example UI route for this plugin (Full Stack - HTML Page)
router.get('/ui', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Plugin Full Stack UI</title>
                <style>
                    body { font-family: sans-serif; background: #f4f4f9; padding: 50px; text-align: center; }
                    .card { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); display: inline-block; }
                    h1 { color: #333; }
                    button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
                    button:hover { background: #0056b3; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>🚀 Full Stack Plugin System</h1>
                    <p>This is an actual user interface served directly from the plugin!</p>
                    <button onclick="alert('The plugin UI is fully interactive!')">Click Me</button>
                </div>
            </body>
        </html>
    `);
});

module.exports = router;
