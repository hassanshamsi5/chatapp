import express from "express";
import { ObjectId } from "mongodb";
import { client } from "../mongodb.mjs";
import OpenAI from "openai";
import "dotenv/config";
const db = client.db("PostCrud");
const col = db.collection("Posts");
const usersCol = db.collection("Users");
let router = express.Router();

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// let posts = [
//     {
//         title: "ExpressCrudApp By Usman",
//         text: "in this app we can post put delete get etc",
//     }
// ]

// POST //create   /api/v1/post

router.get("/profile", async (req, res, next) => {
  try {
    let result = await usersCol.findOne({ email: req.body.decoded.email });
    console.log("result: ", result); // [{...}] []
    res.send({
      message: "profile fetched",
      data: {
        isAdmin: result.isAdmin,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
      },
    });
  } catch (e) {
    console.log("error getting data mongodb: ", e);
    res.status(500).send("server error, please try later");
  }
});

router.post("/post", async (req, res, next) => {
  console.log("This is create post request", new Date());

  if (
    req.body.PostTitle.trim().length == 0 ||
    req.body.Desc.trim().length == 0
  ) {
    res.status(403);
    res.send(`required parameters missing, 
        example request body:
        {
            PostTitle: "abc post title",
            PostDesc: "some post text"
        } `);
    return;
  }

  // Insert a single document, wait for promise so we can read it back
  const insertedDocResponse = await col.insertOne({
    PostTitle: req.body.PostTitle,
    Desc: req.body.Desc, // May 23, 1912
    authorEmail: req.body.decoded.email,
    authorId: new ObjectId(req.body.decoded._id),
    createdOn: new Date(),
  });

  console.log(insertedDocResponse);

  res.send("Post created");
});
// GET     /api/v1/posts/:userId
router.get("/posts", async (req, res, next) => {
  const userId = req.query._id || req.body.decoded._id;

  if (!ObjectId.isValid(userId)) {
    res.status(403).send(`Invalid user id`);
    return;
  }

  const cursor = col
    .find({ authorId: new ObjectId(userId) })
    .sort({ _id: -1 })
    .limit(100);

  try {
    let results = await cursor.toArray();
    console.log("results: ", results);
    res.send(results);
  } catch (e) {
    console.log("error getting data mongodb: ", e);
    res.status(500).send("server error, please try later");
  }
});
// GET     /api/v1/post/:userId/:postId
router.get("/post/:postId", async (req, res, next) => {
  console.log("this is specific post request v1", new Date());
  //res.send('this is created post v1');
  const postId = new ObjectId(req.params.postId);
  if (!ObjectId.isValid(postId)) {
    res.status(403).send(`Invalid post id`);
    return;
  }

  try {
    let result = await col.findOne({ _id: new ObjectId(postId) });
    console.log("result: ", result); // [{...}] []
    res.send(result);
  } catch (e) {
    console.log("error getting data mongodb: ", e);
    res.status(500).send("server error, please try later");
  }
});
const getProfileMiddleware = async (req, res, next) => {
  const userId = req.params.userId || req.body.decoded._id;

  if (!ObjectId.isValid(userId)) {
    res.status(403).send(`Invalid user id`);
    return;
  }

  try {
    let result = await userCollection.findOne({ _id: new ObjectId(userId) });
    console.log("result: ", result); // [{...}] []
    res.send({
      message: "profile fetched",
      data: {
        isAdmin: result?.isAdmin,
        firstName: result?.firstName,
        lastName: result?.lastName,
        email: result?.email,
        _id: result?._id,
      },
    });
  } catch (e) {
    console.log("error getting data mongodb: ", e);
    res.status(500).send("server error, please try later");
  }
};
router.get("/profile", getProfileMiddleware);
router.get("/profile/:userId", getProfileMiddleware);

router.get("/feed", async (req, res, next) => {
  const cursor = col.find({}).sort({ _id: -1 }).limit(100);

  try {
    let results = await cursor.toArray();
    console.log("results: ", results);
    res.send(results);
  } catch (e) {
    console.log("error getting data mongodb: ", e);
    res.status(500).send("server error, please try later");
  }
});

// PUT     /api/v1/post/:userId/:postId
router.put("/post/update/:postId", async (req, res, next) => {
  console.log("this is post v1", new Date());

  const postId = new ObjectId(req.params.postId);
  if (
    postId &&
    req.body.PostTitle.trim().length != 0 &&
    req.body.Desc.trim().length != 0
  ) {
    let updtPostObj = await col.updateOne(
      { _id: postId },
      {
        $set: { PostTitle: req.body.PostTitle, Desc: req.body.Desc },
        $currentDate: { lastModified: true },
      }
    );
    res.send(`Post Updated Succesfully`);
    return;
  }

  res.send(`Please donot leave the given fields Empty`);
  res.status(422);
});

// DELETE  /api/v1/post/:userId/:postId
router.delete("/post/delete/:postId", async (req, res, next) => {
  console.log("this is delete post v1", new Date());

  const postId = new ObjectId(req.params.postId);
  if (postId) {
    let delResp = await col.deleteOne({ _id: postId });
    res.send(`Successfully deleted the Post`);
    return;
  }

  res.send("Please enter an valid PostID");
  res.status(404);
});

router.get("/search", async (req, res, next) => {
  try {
    const response = await openaiClient.embeddings.create({
      model: "text-embedding-ada-002",
      input: req.query.q,
    });
    const vector = response?.data[0]?.embedding;
    console.log("vector: ", vector);
    // [ 0.0023063174, -0.009358601, 0.01578391, ... , 0.01678391, ]

    // Query for similar documents.
    const documents = await col
      .aggregate([
        {
          $search: {
            index: "crudVectorindex",
            knnBeta: {
              vector: vector,
              path: "embedding",
              k: 10, // number of documents
            },
            scoreDetails: true,
          },
        },
        {
          $project: {
            embedding: 0,
            score: { $meta: "searchScore" },
            scoreDetails: { $meta: "searchScoreDetails" },
          },
        },
      ])
      .toArray();

    documents.map((eachMatch) => {
      console.log(
        `score ${eachMatch?.score?.toFixed(3)} => ${JSON.stringify(
          eachMatch
        )}\n\n`
      );
    });
    console.log(`${documents.length} records found `);

    res.send(documents);
  } catch (e) {
    console.log("error getting data mongodb: ", e);
    res.status(500).send("server error, please try later");
  }
});

export default router;
