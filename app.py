from flask import Flask, render_template, request, url_for,flash,redirect,flash , session
from data import exercises
import sqlite3


app = Flask(__name__)
app.secret_key = 'asdf'

# Initialize database
def init_db():
    conn = sqlite3.connect('database.db')
    conn.execute('''  CREATE TABLE IF NOT EXISTS users(
                        id integer primary key autoincrement,
                        name text not null,
                        email text unique not null,
                        password text not null
                    )''')
    conn.close()

init_db()


@app.route("/")
def home():
    return render_template("home.html")



@app.route("/main")
def main():
    return render_template("main.html")


@app.route("/signup" , methods=['GET','POST'])
def signup():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        print(f"{name} and {email} and {password}")
        try:
            conn= sqlite3.connect('database.db')
            cusor=conn.cursor()
            cusor.execute("insert into users (name,email,password) values (?,?,?)",(name,email,password))
            conn.commit()
            conn.close()
            flash("Signup successful! Please login.","success")
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            flash('email already exists!' ,"error")
            
    return render_template("signup.html")



@app.route("/login", methods=['GET','POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        conn= sqlite3.connect('database.db')
        cursor=conn.cursor()
        cursor.execute("select password from users where email = ?",(email,))
        record = cursor.fetchone()
        conn.close()
        
        
        if record and password:
            session['email'] = email
            flash('Login successful!', 'login_success')
            print("success")
            return redirect(url_for("main"))
        else:
            flash("Invalid email or password!" , "error")
            print("error")
            
    return render_template("login.html")

            
@app.route('/logout')
def logout():
    session.pop('email',None)
    flash('You have successfully logged out.', 'logout_success')

    return redirect(url_for('home'))


@app.route("/chatbot")
def chatbot():
    return render_template("chatbot.html")



@app.route("/exercise")
def exercise():
    return  render_template("exercise.html" ,exercises=exercises)




if __name__ == '__main__':
    app.run(debug=True )
    