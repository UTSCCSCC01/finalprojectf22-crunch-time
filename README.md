## Motivation

This is a web application allowing like-minded individuals to find each other and organize activities. Users can search and join groups based on interests and location proximity, after which they may communicate with others in the group to organize activities together, like sports or board games.

We hope people will be able to use this application to meet up, make new friends, and form lasting bonds over common interests.

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
npm install --legacy-peer-deps

npm start
```

Now the app should be available at <http://localhost:3000>.

## Contributing

Git flow is used for this project:

- The `main` branch holds production releases.
- Development is done from the `develop` branch.
  - The `develop` branch should contain stable features.
- To develop features, branch off from `develop` into a new branch `feature-[feature name]`, e.g. `feature-registration`.
  - Changes in the `develop` branch should be merged back into in-progress feature branches.
  - Once the feature is stable and ready, merge back into `develop`.
- For releases, create a new branch from `develop` named `release-[version number]` to isolate it from active development.
  - Bug fixes in this branch should be merged back into `develop`.
  - Once the release is ready, it can be merged into `main`.
- To perform a hotfix on a production release, create a new branch off `main` named `hotfix-[hotfix name]` and perform the fix there.
  - Once complete, it may be merged back into `main` as a new release, as well as the `develop` branch so the fix may be integrated into active development.

For now, GitHub Issues will be used to track issues.

Pull requests will be used to allow others to review code before it is merged into a branch.
