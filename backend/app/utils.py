def rows_to_dicts(rows):
    """Converts a list of sqlite3.Row to a list of dicts."""
    return list(map(dict, rows))
