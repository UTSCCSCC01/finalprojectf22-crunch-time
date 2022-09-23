import os
from flask import Flask

app = Flask(__name__)

app.config.from_mapping(
    DATABASE=os.path.join(app.instance_path, 'db.sqlite')
)

# ensure instance folder exists
try:
    os.makedirs(app.instance_path)
except OSError:
    pass

from . import db, api
db.init_app(app)