import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, {Request, Response} from "express";
import cors from "cors";
import {Todo} from "./models/todo";

admin.initializeApp();

const app = express();
const {Timestamp} = admin.firestore;
type DocumentReference = admin.firestore.DocumentReference;

app.use(cors({origin: true}));

const db = admin.firestore();

app.post(
    "/todos/:userUID/:familyId",
    async (req: Request, res: Response): Promise<void> => {
        const {userUID, familyId} = req.params;
        const newDocRef = db.collection("todos").doc();

        const todo = {
            userUID,
            familyId,
            ...req.body,
            startDate: req.body.startDate ?
                Timestamp.fromDate(new Date(req.body.startDate)) :
                null,
            endDate: req.body.endDate ?
                Timestamp.fromDate(new Date(req.body.endDate)) :
                null,
            completedDate: req.body.completedDate ?
                Timestamp.fromDate(new Date(req.body.completedDate)) :
                null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const responseTodo = await saveAndRetrieveTodo(newDocRef, todo);
        const convertedTodo = convertFirestoreTimestamps(responseTodo);

        res.status(201).send(convertedTodo);
    }
);

app.put(
    "/todos/:userUID/:familyId/:id",
    async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        const docRef = db.collection("todos").doc(id);
        const updatedTodo = {
            ...req.body,
            startDate: req.body.startDate ?
                Timestamp.fromDate(new Date(req.body.startDate)) :
                null,
            endDate: req.body.endDate ?
                Timestamp.fromDate(new Date(req.body.endDate)) :
                null,
            completedDate: req.body.completedDate ?
                Timestamp.fromDate(new Date(req.body.completedDate)) :
                null,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const responseTodo = await saveAndRetrieveTodo(docRef, updatedTodo);
        const convertedTodo = convertFirestoreTimestamps(responseTodo);

        res.status(200).send(convertedTodo);
    }
);

app.get(
    "/todos/:userUID/:familyId",
    async (req: Request, res: Response): Promise<void> => {
        const {userUID, familyId} = req.params;
        const snapshot = await db
            .collection("todos")
            .where("userUID", "==", userUID)
            .where("familyId", "==", familyId)
            .get();
        const todos: Todo[] = snapshot.docs.map((doc) => {
            const todoData = doc.data();
            const convertedTodo = convertFirestoreTimestamps({id: doc.id, ...todoData}); // id값추가 2024.05.15-1
            return convertedTodo;
        });

        res.status(200).json(todos);
    }
);

app.get(
    "/todos/:userUID/:familyId/:id",
    async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        const doc = await db.collection("todos").doc(id).get();
        if (!doc.exists) {
            res.status(404).send("Todo not found");
        } else {
            const todoData = convertFirestoreTimestamps({id: doc.id, ...(doc.data() as Todo)}); // id값추가 2024.05.15-1
            res.status(200).json(todoData);
        }
    }
);

app.delete(
    "/todos/:userUID/:familyId/:id",
    async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        await db.collection("todos").doc(id).delete();
        res.status(200).send();
    }
);

async function saveAndRetrieveTodo(docRef: DocumentReference, todo: Todo) {
    await docRef.set(todo);
    const savedDoc = await docRef.get();
    const todoData = savedDoc.data();
    return {id: savedDoc.id, ...(todoData as Todo)}; // id값추가 2024.05.15-1
}

function convertFirestoreTimestamps(data: FirebaseFirestore.DocumentData): Todo {
    // Helper function to convert Timestamp to Date or pass through the value
    const toDateOrPass = (value: any): Date | null => {
        return value instanceof Timestamp ? value.toDate() : value;
    };

    return {
        id: data.id, // id값추가 2024.05.15-1
        userUID: data.userUID,
        familyId: data.familyId,
        name: data.name,
        title: data.title,
        description: data.description,
        isCompleted: data.isCompleted,
        startDate: toDateOrPass(data.startDate),
        endDate: toDateOrPass(data.endDate),
        completerName: data.completerName,
        completerId: data.completerId,
        completedDate: toDateOrPass(data.completedDate),
        alarmTime: toDateOrPass(data.alarmTime),
        isLunarCalendar: data.isLunarCalendar,
        dDayAsDate: toDateOrPass(data.dDayAsDate),
        createdAt: toDateOrPass(data.createdAt),
        updatedAt: toDateOrPass(data.updatedAt),
    };
}

exports.api = functions.https.onRequest(app);
