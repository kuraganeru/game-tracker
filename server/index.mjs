import * as dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import got from "got"
import pgPromise from "pg-promise"

// express
const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// pg-promise
const pgp = pgPromise({})
const connection = {
    user: process.env.PG_USER,
    password: process.env.PG_PW,
    host: "localhost",
    port: 5432,
    database: "gamelist"
}
const db = pgp(connection)

// User Routes

// Add user to list
app.post("/users", async (req, res) => {
    const { username } = req.body
    const addUser = await db.one("INSERT INTO users(username) VALUES ($1) RETURNING *", [username])
    res.json(addUser)
})



// Game Routes

// Get all games
app.get("/games", async (req, res) => {
    let joinQuery = `
        SELECT ug.users_games_id, ug.user_id, ug.game_status, ug.game_review, ug.game_rating, ug.game_platform, ug.year_completed, g.game_id, g.title, g.game_img, g.game_igdb_id, g.game_platforms_all
        FROM games g
        JOIN users_games ug
        ON g.game_id = ug.game_id
        ORDER BY g.title ASC
    `
    try {
        const allGames = await db.any(joinQuery)
        res.json(allGames)
    } catch (error) {
        console.error("get /games error", error)
        res.json(error.message)
    }
})

// Add game to database
app.post("/games", async (req, res) => {
    console.log("req body on server: ", req.body)
    const { title, game_status, game_rating, game_review, game_img, game_platform, year_completed, game_platforms_all, game_igdb_id } = req.body;
    const userId = 1
    await db.tx(async t => {
        const checkIfGameExists = await t.any("SELECT game_igdb_id from games WHERE game_igdb_id = $1", [game_igdb_id])
        if (checkIfGameExists.length > 0) {
            throw "Game already exists in DB"
        } else {

            // 1. Insert into games table
            const insertGame = await t.one("INSERT INTO games (title, game_igdb_id, game_img, game_platforms_all) VALUES ($1, $2, $3, $4) RETURNING game_id", [title, game_igdb_id, game_img, game_platforms_all])

            // 2. Insert platforms into platforms table
            const platformsDb = await t.any("SELECT platform FROM platforms")
            const platformsDBArr = platformsDb.reduce((prevVal, currentVal) => prevVal.concat(currentVal.platform), [])
            const platformsInsertGame = JSON.parse(game_platforms_all).reduce((prevVal, currentVal) => prevVal.concat(currentVal.name), [])
            const platformsFiltered = platformsInsertGame.filter(value => !platformsDBArr.includes(value))
            console.log("platformsfiltered", platformsFiltered)
            if (platformsFiltered.length > 0) {
                await t.none("INSERT INTO platforms (platform) SELECT * FROM UNNEST(ARRAY[$1])", [platformsFiltered])
            }

            // 3. Insert into platforms join table
            const gamePlatformId = await t.one("SELECT platform_id FROM platforms WHERE platform = $1", [game_platform])
            await t.none("INSERT INTO games_platforms (games_id, platform_id) VALUES ($1, $2)", [insertGame.game_id, gamePlatformId.platform_id])

            // 4. Insert into users_games tabl7e
            await t.none("INSERT INTO users_games(user_id, game_id, game_status, game_rating, game_review, game_platform, year_completed) VALUES ($1, $2, $3, $4, $5, $6, $7)", [
                userId,
                insertGame.game_id,
                game_status,
                game_rating,
                game_review,
                game_platform,
                year_completed
            ])
        }
    }).then(() => {
        console.log("Insert successful")
        res.json("success")
    }).catch(err => {
        console.log("err msg:", err)
        res.json("error")
        // res json some error so it can be handled on front end
    })
})

// Update game in database
// Updates values in users_games table
app.put("/games/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { game_status, game_rating, game_review, year_completed, game_platform } = req.body;
        console.log("edit body", req.body)

        await db.none("UPDATE users_games SET game_status = $1, game_rating = $2, game_review = $3, year_completed = $4, game_platform = $5 WHERE users_games_id = $6", [game_status, game_rating, game_review, year_completed, game_platform, id])
        res.json("success")
    } catch (error) {
        console.error("update error", error)
        res.json(error.message)
    }
})

// Delete game from database
// Delete on "games" table cascades delete to "users_games"
app.delete("/games/:id", async (req, res) => {
    try {
        const { id } = req.params

        await db.tx(async t => {
            const gameToDelete = await t.one("SELECT game_id FROM users_games WHERE users_games_id = $1", [id])
            const gameToDeleteId = gameToDelete.game_id
            if (!gameToDeleteId) {
                throw "Err: Could not find item to delete in DB"
            }
            await t.none("DELETE FROM games WHERE game_id = $1", [gameToDeleteId])
        }).then(() => {
            res.json("success")
        })
    } catch (error) {
        console.error(error.message)
        res.json(error.message)
    }
})

// Filtering
app.get("/games/filter", async (req, res) => {
    const { game_status, game_rating, game_platform, game_year } = req.query
    let whereQueryString = ''

    for (const [key, value] of Object.entries(req.query)) {
        if (whereQueryString.length === 0) {
            whereQueryString += `WHERE ${key} = '${value}'`
        } else {
            whereQueryString += `AND ${key} = '${value}'`
        }
    }
    // console.log(whereQueryString)

    const joinQuery = `
        SELECT ug.users_games_id, ug.user_id, ug.game_status, ug.game_review, ug.game_rating, ug.game_platform, ug.year_completed, g.game_platforms_all, g.game_id, g.title, g.game_img
        FROM games g
        JOIN users_games ug
        ON g.game_id = ug.game_id
        ${whereQueryString}
        ORDER BY g.title ASC
    `

    try {
        const filteredGames = await db.any(joinQuery)
        console.log(filteredGames)
        res.json(filteredGames)
    } catch (error) {
        console.error(error.message)
        res.json(error.message)
    }
})

// Return platforms - for filtering
app.get("/platforms", async (req, res) => {
    try {
        // const platforms = await db.any("SELECT platform FROM platforms")
        const platforms = await db.any("SELECT gp.platform_id, p.platform FROM platforms p JOIN games_platforms gp ON p.platform_id = gp.platform_id")
        res.json(platforms)
    } catch (error) {
        console.error(error.message)
        res.json(error.message)
    }
})

// IGDB API call for title, images, game IDs
app.post("/games/search/:id", async (req, res) => {
    const bodyQuery = `search "${req.params.id}"; fields name, cover.image_id, platforms.name, category; where cover.image_id != null & platforms != null & version_parent = null; limit 5;`
    const response = await got("https://api.igdb.com/v4/games", {
        method: "POST",
        headers: {
            "Client-ID": process.env.IGDB_CLIENT_ID,
            "Authorization": process.env.IGDB_AUTH,
            "Content-Type": "application/json"
        },
        body: bodyQuery
    }).json()
    console.log(response)
    res.json(response)
})

app.listen(5000, () => {
    console.log("Server started on port 5000")
})