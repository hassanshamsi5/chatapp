import express from "express";
import { client } from "../mongodb.mjs";
import { stringToHash, varifyHash } from "bcrypt-inzi";
import jwt from "jsonwebtoken";
const db = client.db("PostCrud");
const col = db.collection("Users");

let router = express.Router();

//////////////// Checking User in mongoDb database (Sign In) ///////////////
router.post("/signin", async (req, res, next) => {
  if (
    req.body?.email.trim().length == 0 ||
    req.body?.password.trim().length == 0
  ) {
    res.status(403);
    res.send(`required parameters missing, 
        example request body:
        {
          email: "abc user email"
          password: "abc user password"
        } `);
    return;
  }

  req.body.email = req.body.email.toLowerCase();

  try {
    const fetchhuserData = await col.findOne({
      email: req.body.email,
    });

    if (!fetchhuserData) {
      res.status(403).send({ message: "email or password incorrect" });
    } else {
      const comparingPass = varifyHash(
        req.body.password,
        fetchhuserData.password
      );

      if (comparingPass) {
        const token = jwt.sign(
          {
            isAdmin: fetchhuserData.isAdmin,
            firstName: fetchhuserData.firstName,
            lastName: fetchhuserData.lastName,
            email: req.body.email,
            _id: fetchhuserData._id,
          },
          process.env.SECRET,
          {
            expiresIn: "48hr",
          }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
        });
        res.send({
          message: "logged in successfully",
          data: {
            isAdmin: fetchhuserData.isAdmin,
            firstName: fetchhuserData.firstName,
            lastName: fetchhuserData.lastName,
            email: req.body.email,
          },
        });
        return;
      } else {
        res.status(401).send({ message: "email or password incorrect" });
        return;
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("server error please try again", err);
  }
});

router.post("/logout", async (req, res, next) => {
  res.clearCookie("token");
  res.send({ message: "logout successful" });
});

router.post("/signup", async (req, res, next) => {
  console.log("this is signup!", new Date());
  ///////////////// Validate Info ////////////////////////////////////

  if (
    req.body?.email.trim().length == 0 ||
    req.body?.password.trim().length == 0 ||
    req.body?.firstName.trim().length == 0 ||
    req.body?.lastName.trim().length == 0
  ) {
    res.status(403);
    res.send(`required parameters missing, 
    example request body:
    {
        firstName: "abc user first name",
        lastName: "abc user last name"
        email: "abc user email"
        password: "abc user password"

    } `);
    return;
  }

  req.body.email = req.body.email.toLowerCase();

  try {
    const check = await col.findOne({
      email: req.body.email,
    });

    if (!check) {
      const passwordHash = await stringToHash(req.body.password);
      const result = await col.insertOne({
        isAdmin: false,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: passwordHash,
        createdOn: new Date(),
      });
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      res.send({ message: "Signup successful" });
    } else {
      res.status(403).send({
        message: "user already exist with this email",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
