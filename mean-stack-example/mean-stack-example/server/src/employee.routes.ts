import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const employeeRouter = express.Router();
employeeRouter.use(express.json());

// GET all employees
employeeRouter.get("/", async (_req, res) => {
  try {
    const employees = await collections?.employees?.find({}).toArray();
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : "Unknown error");
  }
});

// GET employee by ID
employeeRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params?.id;
    const query = { _id: new ObjectId(id) };
    const employee = await collections?.employees?.findOne(query);

    if (employee) {
      res.status(200).send(employee);
    } else {
      res.status(404).send(`Failed to find an employee: ID ${id}`);
    }
  } catch (error) {
    res.status(404).send(`Failed to find an employee: ID ${req.params?.id}`);
  }
});

// POST create a new employee
employeeRouter.post("/", async (req, res) => {
  try {
    const employee = req.body;
    const result = await collections?.employees?.insertOne(employee);

    if (result?.acknowledged) {
      res.status(201).send(`Created a new employee: ID ${result.insertedId}.`);
    } else {
      res.status(500).send("Failed to create a new employee.");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error instanceof Error ? error.message : "Unknown error");
  }
});

// PUT update employee by ID
employeeRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params?.id;
    const employee = req.body;

    // Remove immutable _id field so MongoDB accepts the update query
    delete employee._id;

    const query = { _id: new ObjectId(id) };
    const result = await collections?.employees?.updateOne(query, { $set: employee });

    if (result && result.matchedCount > 0) {
      res.status(200).send(`Updated an employee: ID ${id}.`);
    } else {
      res.status(404).send(`Failed to find an employee: ID ${id}`);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error instanceof Error ? error.message : "Unknown error");
  }
});

// DELETE employee by ID
employeeRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await collections?.employees?.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Removed an employee: ID ${id}`);
    } else if (!result) {
      res.status(400).send(`Failed to remove an employee: ID ${id}`);
    } else if (!result.deletedCount) {
      res.status(404).send(`Failed to find an employee: ID ${id}`);
    }
  } catch (error) {
    console.error(error);
    res.status(400).send(error instanceof Error ? error.message : "Unknown error");
  }
});