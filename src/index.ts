import express from 'express';

export const app = express();
const port = 4000;

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
};

const JsonBodyMiddleware = express.json();
app.use(JsonBodyMiddleware);

const db = {
    users: [
        {id: 1, name: 'Rava'},
        {id: 2, name: 'Anvar'},
        {id: 3, name: 'Ruslan'},
        {id: 4, name: 'Rahmatillo'}
    ]
};

app.get('/users', (req, res) => {

    res.status(HTTP_STATUSES.OK_200).json(db.users);
});

app.get('/user/:id', (req, res) => {
    const userId = +req.params.id;

    if (!userId) res.status(HTTP_STATUSES.NOT_FOUND_404).json({error: 'user id not found as uri parameter'});

    const foundUsers = db.users.filter(u => u.id === userId);

    res.status(HTTP_STATUSES.OK_200).json(foundUsers);
});

app.post('/user', async (req, res) => {
    const userName = req.body.name;
    if (!userName) return res.status(HTTP_STATUSES.BAD_REQUEST_400).json({error: 'name in body is not exited'});

    const createdUser = {
        id: +(new Date()),
        name: userName
    };
    db.users.push(createdUser);
    res.status(HTTP_STATUSES.CREATED_201).json(createdUser);
});

app.put('/user/:id', (req, res) => {
    const userName = req.body.name;
    const userId = +req.params.id;

    if (!userName) res.status(HTTP_STATUSES.BAD_REQUEST_400).json({error: 'name parameter in body is not exist'});

    const foundUser = db.users.find(user => user.id === userId);

    if (!foundUser) res.status(HTTP_STATUSES.NOT_FOUND_404).json({error: 'user with id in uri not found'});

    foundUser!.name = userName;

    res.status(HTTP_STATUSES.CREATED_201).json(foundUser);
});

app.delete('/user/:id', (req, res) => {
    const userId = req.params.id;

    if (!userId) res.status(HTTP_STATUSES.BAD_REQUEST_400).json({error: 'unknown uri parameter'});

    db.users = db.users.filter(user => user.id !== +userId);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.delete('/__test__/data', (req, res) => {
    db.users = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
