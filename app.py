from flask import Flask, render_template, request, url_for
from data import exercises

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")


@app.route("/signup")
def signup():
    return render_template("signup.html")



@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/chatbot")
def chatbot():
    return render_template("chatbot.html")



@app.route("/exercise")
def exercise():
    return  render_template("exercise.html" ,exercises=exercises)





if __name__ == '__main__':
    app.run(debug=True )