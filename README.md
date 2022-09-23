## Motivation

TODO

## Installation (Linux)

Make sure python3 and node/npm are installed.

Set up and run the backend (run these commands in the `backend/` directory):

```sh
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
flask init-db

flask --debug run
```

Set up and run the frontend (run these commands in the `frontend/` directory):

```sh
npm install

npm start
```

Now the app should be available at <http://localhost:3000>.

## Contribution

TODO