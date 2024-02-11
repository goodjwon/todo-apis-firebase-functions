// functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, {Request, Response} from "express";
import cors from "cors";
import {Todo} from "./models/todo";

admin.initializeApp();

const app = express();
app.use(cors({origin: true}));

const db = admin.firestore();

app.post(
    "/todos/:userId/:familyId",
    async (req: Request, res: Response): Promise<void> => {
        const {userId, familyId} = req.params;
        const todo: Todo = {
            userId,
            familyId,
            ...req.body,
        };
        const newDocRef = db.collection("todos").doc();
        await newDocRef.set(todo);
        res.status(201).send({id: newDocRef.id, ...todo});
    }
);

app.put(
    "/todos/:userId/:familyId/:id",
    async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        const updatedTodo: Partial<Todo> = req.body;
        const docRef = db.collection("todos").doc(id);
        await docRef.set(updatedTodo, {merge: true});
        res.status(200).send({id, ...updatedTodo});
    }
);

app.get(
    "/todos/:userId/:familyId",
    async (req: Request, res: Response): Promise<void> => {
        const {userId, familyId} = req.params;
        const numericUserId = parseInt(userId, 10);
        const snapshot = await db
            .collection("todos")
            .where("userId", "==", numericUserId)
            .where("familyId", "==", familyId)
            .get();
        const todos: Todo[] = snapshot.docs.map(
            (doc) => ({id: doc.id, ...doc.data()} as Todo)
        );
        res.status(200).json(todos);
    }
);

app.get(
    "/todos/:userId/:familyId/:id",
    async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        const doc = await db.collection("todos").doc(id).get();
        if (!doc.exists) {
            res.status(404).send("Todo not found");
        } else {
            res.status(200).json({id: doc.id, ...doc.data()} as Todo);
        }
    }
);

app.delete(
    "/todos/:userId/:familyId/:id",
    async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        await db.collection("todos").doc(id).delete();
        res.status(200).send();
    }
);

exports.api = functions.https.onRequest(app);
