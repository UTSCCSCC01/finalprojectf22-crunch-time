from flask import request

from app import app
from app.db import get_db

@app.route('/example', methods=['GET', 'POST'])
def example():
    db = get_db()
    if request.method == 'POST':
        db.execute('INSERT INTO Example (contents) VALUES (?)',
            (request.form['message'],))
        db.commit()
    messages = db.execute('SELECT * FROM Example').fetchall()
    return {'messages': list(map(dict, messages))}
d