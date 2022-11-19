import os
from flask import Flask
app = Flask(__name__)

app.config.from_mapping(
    DATABASE=os.path.join(app.instance_path, 'db.sqlite'),
    GROUP_PICS_DIR=os.path.join(app.instance_path, 'group_pics')
)


# ensure instance folder exists
try:
    os.makedirs(app.instance_path)
except OSError:
    pass
try:
    os.makedirs(app.config['GROUP_PICS_DIR'])
except OSError:
    pass

from . import db, routes
db.init_app(app)

