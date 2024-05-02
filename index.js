//Imports
const express = require("express");
const app = express();
const mysql = require('mysql2/promise');
const path = require("node:path");
const fs = require("node:fs");
app.use(express.urlencoded({extended: true}));
app.use(express.json());
let currentUser = null;

//Static files
app.use("/images", express.static(path.resolve(__dirname, "./public/images")));
app.use("/scripts", express.static(path.resolve(__dirname, "./public/scripts")));
app.use("/styles", express.static(path.resolve(__dirname, "./public/styles")));

//Functions
/*Pages*/
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./app/html/index.html"));
});


app.get("/Community", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./app/html/community.html"));
});

app.get("/Post", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./app/html/post.html"));
});

app.get("/CreatePost", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./app/html/createPost.html"));
});

app.get("/Construction", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./app/html/construction.html"));
});

// app.get("/about", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "./app/html/about.html"));
// });

app.get("/login", (req, res) => {
    let filePath = currentUser ? "./app/html/profile.html" : "./app/html/login.html";
    res.sendFile(path.resolve(__dirname, filePath));
});

app.get("/profile", (req, res) => {
    let filePath = currentUser ? "./app/html/profile.html" : "./app/html/login.html";
    res.sendFile(path.resolve(__dirname, filePath));
});

/*Snippets of HTML*/
app.get("/get-header", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./app/data/header.html"));
});

app.get("/get-navbar", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./app/data/navbar.html"));
});

app.get("/get-footer", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./app/data/footer.html"));
});


/*construction.html
* */

/*Snippets of HTML*/
app.get("/get-constructionList", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./app/data/constructionList.html"));
});

app.get("/get-constructionList-data", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./app/data/constructionList_data.json"));
});

/*Interactions*/
app.get("/languages", (req, res) => {
    const languageDir = path.resolve(__dirname, "./app/data/language");
    fs.readdir(languageDir, (err, files) => {
        if (err) {
            console.error("Could not list the directory.", err);
            res.status(500).send("Server error when listing languages");
            return;
        }
        const languages = files.map(file => {
            const code = file.split(".")[0];
            const name = code; // 简单示例，直接使用code作为显示名称
            return {code, name};
        });
        res.json(languages);
    });
});

app.get("/languages/:lang", (req, res) => {
    const lang = req.params.lang;
    const languageFilePath = path.resolve(__dirname, `./app/data/language/${lang}.json`);
    if (fs.existsSync(languageFilePath)) {
        res.sendFile(languageFilePath);
    } else {
        res.status(404).send({error: "Language file not found."});
    }
});

app.post("/add-construction", (req, res) => {
    const newBuilding = req.body;
    const filePath = path.resolve(__dirname, "./app/data/constructionList_data.json");

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error("Error reading construction list data:", err);
            return res.status(500).send("Error reading construction data");
        }

        const constructionData = JSON.parse(data.toString());
        constructionData.buildings.push(newBuilding);

        fs.writeFile(filePath, JSON.stringify(constructionData, null, 2), (err) => {
            if (err) {
                console.error("Error writing construction list data:", err);
                return res.status(500).send("Error updating construction data");
            }

            res.status(200).send("Construction added successfully");
        });
    });
});


/*Database*/
/**
 * Creates a new connection to the MySQL database with the specified configuration.
 *
 * @return {Promise<Connection>} A Promise that resolves with the MySQL Connection object.
 */
async function createConnection() {
    return mysql.createConnection({
        host: "localhost", user: "root", password: "Xjr@66773738", database: "assignment6"
    });
}

/**
 * Handles the login form submission and redirects to the profile page if the credentials are valid.
 */
app.post('/user-login', async (req, res) => {
    const {username, password} = req.body;
    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT * FROM a01354731_user WHERE user_name = ? AND password = ?', [username, password]);

    if (rows.length > 0) {
        currentUser = rows[0];
        res.redirect('/profile');
    } else {
        res.send(`
            <p>Username or password is incorrect. Please try again.</p>
            <a href="/login">Back to Log in</a>
        `);
    }
});

/**
 * Handles the registration form submission
 * and redirects to the login page if the registration is successful.
 */
app.post('/user-register', async (req, res) => {
    const {email, username, password, confirmPassword} = req.body;

    if (password !== confirmPassword) {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Passwords Do Not Match</title>
                <script type="text/javascript">
                    alert("Passwords do not match. Please try again.");
                    window.location.href = '/login';
                </script>
            </head>
            <body>
            </body>
            </html>
        `);
        return;
    }

    try {
        const connection = await createConnection();
        const [users] = await connection.execute('SELECT * FROM a01354731_user WHERE email = ? OR user_name = ?', [email, username]);

        if (users.length > 0) {
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <title>Email or Username Already Exists</title>
                    <script type="text/javascript">
                        alert("Email or username already exists. Please login or try again .");
                        window.location.href = '/login';
                    </script>
                </head>
                <body>
                </body>
                </html>
            `);
            return;
        }

        await connection.execute('INSERT INTO a01354731_user (email, user_name, password) VALUES (?, ?, ?)', [email, username, password]);
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Registration Successful</title>
                <script type="text/javascript">
                    alert("Registration successful! Redirecting to login page.");
                    window.location.href = '/login';
                </script>
            </head>
            <body>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Database operation error:", error);
        res.status(500).send('An error occurred.');
    }
});


/*
* Function to edit profile
* */
app.post('/update-profile', async (req, res) => {
    if (!currentUser) {
        return res.status(401).json({success: false, message: "User not logged in"});
    }

    const {username, email, firstName, lastName, oldPassword, newPassword} = req.body;

    try {
        const connection = await createConnection();
        let updates = [];
        let params = [];

        if (username && username !== currentUser.user_name) {
            const [userCheck] = await connection.execute('SELECT * FROM a01354731_user WHERE user_name = ?', [username]);
            if (userCheck.length > 0) {
                return res.json({success: false, message: "Username is already taken."});
            } else {
                updates.push("user_name = ?");
                params.push(username);
            }
        }

        if (email && email.trim()) {
            updates.push("email = ?");
            params.push(email.trim());
        }
        if (firstName && firstName.trim()) {
            updates.push("first_name = ?");
            params.push(firstName.trim());
        }
        if (lastName && lastName.trim()) {
            updates.push("last_name = ?");
            params.push(lastName.trim());
        }

        if (oldPassword && newPassword && oldPassword.trim() && newPassword.trim()) {
            const [user] = await connection.execute('SELECT * FROM a01354731_user WHERE user_name = ? AND password = ?', [currentUser.user_name, oldPassword.trim()]);
            if (user.length === 0) {
                return res.json({success: false, message: "Old password is incorrect"});
            } else {
                updates.push("password = ?");
                params.push(newPassword.trim());
            }
        }

        if (updates.length > 0) {
            params.push(currentUser.user_name);
            const query = `UPDATE a01354731_user
                           SET ${updates.join(", ")}
                           WHERE user_name = ?`;
            await connection.execute(query, params);
            const [updatedRows] = await connection.execute('SELECT * FROM a01354731_user WHERE user_name = ?', [currentUser.user_name]);
            if (updatedRows.length > 0) {
                currentUser = updatedRows[0];
            }
            res.json({success: true, message: "Profile updated successfully"});
        } else {
            res.json({success: false, message: "No changes were made"});
        }
    } catch (error) {
        console.error("Database operation error:", error);
        res.status(500).json({success: false, message: "An error occurred while updating profile"});
    }
});

/**
 * Function to get current user information
 */
app.get('/get-current-user', async (req, res) => {
    if (!currentUser) {
        return res.status(401).send("User not logged in");
    }

    try {
        const connection = await createConnection();
        const [rows] = await connection.execute('SELECT * FROM a01354731_user WHERE user_name = ?', [currentUser.user_name]);
        if (rows.length > 0) {
            const userInfo = {
                username: rows[0].user_name,
                email: rows[0].email,
                firstName: rows[0].first_name || '',
                lastName: rows[0].last_name || '',
            };
            res.json(userInfo);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Database operation error:", error);
        res.status(500).send("An error occurred while fetching user info");
    }
});

/**
 * Function to add a new post.
 */
app.post('/post-timeline', async (req, res) => {
    if (!currentUser) {
        return res.status(401).json({success: false, message: "User not logged in"});
    }

    const {postTitle, postText} = req.body;
    try {
        const connection = await createConnection();
        await connection.execute('INSERT INTO a01354731_user_timeline (user_id, post_title, post_text, post_date, post_time, post_views) VALUES (?, ?, ?, CURDATE(), CURTIME(), 0)', [currentUser.id, postTitle, postText]);
        res.json({success: true, message: "Post successfully added"});
    } catch (error) {
        console.error("Database operation error:", error);
        res.status(500).json({success: false, message: "Failed to add post"});
    }
});

/**
 * Function to get all posts.
 */
app.get('/get-posts', async (req, res) => {
    try {
        const connection = await createConnection();
        const [posts] = await connection.execute(`
            SELECT ut.*, u.user_name
            FROM a01354731_user_timeline ut
                     JOIN a01354731_user u ON ut.user_id = u.id
            ORDER BY ut.post_date DESC, ut.post_time DESC
        `);
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Error fetching posts from the database.");
    }
});

/**
 * Function to get post-details.
 */
app.get('/get-post-details', async (req, res) => {
    const postId = req.query.postId;
    if (!postId) {
        return res.status(400).send("Post ID is required");
    }
    try {
        const connection = await createConnection();
        await connection.execute('UPDATE a01354731_user_timeline SET post_views = post_views + 1 WHERE id = ?', [postId]);

        const [postDetails] = await connection.execute('SELECT a01354731_user_timeline.*, a01354731_user.user_name FROM a01354731_user_timeline JOIN a01354731_user ON a01354731_user_timeline.user_id = a01354731_user.id WHERE a01354731_user_timeline.id = ?', [postId]);
        if (postDetails.length > 0) {
            res.json(postDetails[0]);
        } else {
            res.status(404).send("Post not found");
        }
    } catch (error) {
        console.error("Error fetching post details:", error);
        res.status(500).send("Error fetching post details from the database.");
    }
});


/**
 * Start the server.
 */
app.listen(8000);
console.log("Server running on port 8000");
