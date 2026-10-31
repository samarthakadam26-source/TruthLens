"""Application factory: creates and configures the Flask app."""
import os

from flask import Flask, jsonify
from flask_cors import CORS

from app.config import Config
from app.database import close_db, init_db
from app.routes.auth_routes import bp as auth_bp
from app.routes.api_routes import bp as api_bp
from app.routes.health_routes import bp as health_bp
from app.routes.verification_routes import bp as verification_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS: allow the configured frontend origins to use cookies/sessions
    CORS(
        app,
        origins=Config.CORS_ORIGINS,
        supports_credentials=True,
    )

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(verification_bp)

    # Make sure the DB + model folders exist, and the DB is initialized
    os.makedirs(Config.MODEL_DIR, exist_ok=True)
    os.makedirs(Config.DATASET_DIR, exist_ok=True)
    init_db()

    # Close the DB connection after every request
    app.teardown_appcontext(close_db)

    # ── Error handlers ──────────────────────────────────────────────────────
    @app.errorhandler(400)
    def bad_request(_e):
        return jsonify({"error": "Bad request. Please check your input."}), 400

    @app.errorhandler(401)
    def unauthorized(_e):
        return jsonify({"error": "Authentication required."}), 401

    @app.errorhandler(404)
    def not_found(_e):
        return jsonify({"error": "The requested resource was not found."}), 404

    @app.errorhandler(405)
    def method_not_allowed(_e):
        return jsonify({"error": "This HTTP method is not allowed for this endpoint."}), 405

    @app.errorhandler(500)
    def server_error(_e):
        return jsonify({"error": "An internal server error occurred."}), 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=Config.DEBUG)