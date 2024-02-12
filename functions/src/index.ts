import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {DocumentReference} from "firebase-admin/firestore";
import express, {Request, Response} from "express";
import cors from "cors";
import {Todo} from "./models/todo";

admin.initializeApp();

const app = express();
app.use(cors({origin: true}));

const db = admin.firestore();

app.post("/todos/:userId/:familyId", async (req: Request, res: Response): Promise<void> => {
    const {userId, familyId} = req.params;
    const newDocRef = db.collection("todos").doc();
    const todo = {
        userId,
        familyId,
        ...req.body,
        startDate: req.body.startDate ? admin.firestore.Timestamp.fromDate(new Date(req.body.startDate)) : null,
        endDate: req.body.endDate ? admin.firestore.Timestamp.fromDate(new Date(req.body.endDate)) : null,
        completedDate: req.body.completedDate ? admin.firestore.Timestamp.fromDate(new Date(req.body.completedDate)) : null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const responseTodo = await saveAndRetrieveTodo(newDocRef, todo);
    res.status(201).send(responseTodo);
});

app.put("/todos/:userId/:familyId/:id", async (req: Request, res: Response): Promise<void> => {
    const {id} = req.params;
    const docRef = db.collection("todos").doc(id);
    const updatedTodo = {
        ...req.body,
        startDate: req.body.startDate ? admin.firestore.Timestamp.fromDate(new Date(req.body.startDate)) : null,
        endDate: req.body.endDate ? admin.firestore.Timestamp.fromDate(new Date(req.body.endDate)) : null,
        completedDate: req.body.completedDate ? admin.firestore.Timestamp.fromDate(new Date(req.body.completedDate)) : null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const responseTodo = await saveAndRetrieveTodo(docRef, updatedTodo);
    res.status(200).send(responseTodo);
});

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

function convertFirestoreTimestamps(todo:Todo) {
    return {
        ...todo,
        startDate: todo.startDate?.toDate() || null,
        endDate: todo.endDate?.toDate() || null,
        completedDate: todo.completedDate?.toDate() || null,
        createdAt: todo.createdAt?.toDate() || null,
        updatedAt: todo.updatedAt?.toDate() || null,
    };
}

async function saveAndRetrieveTodo(docRef:DocumentReference, todo:Todo) {
    await docRef.set(todo);
    const savedDoc = await docRef.get();
    const todoData = savedDoc.data();
    return {id: savedDoc.id, ...convertFirestoreTimestamps(todoData as Todo)};
}

exports.api = functions.https.onRequest(app);
