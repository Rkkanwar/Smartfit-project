from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# List to store exercises and their respective timers
exercises = []
exercise_counter = 0  # Counter to give each exercise a unique index

@app.route('/')
def home():
    return render_template('index.html')

# Route to add a new exercise
@app.route('/add', methods=['POST'])
def add_exercise():
    global exercise_counter
    data = request.get_json()
    exercise_name = data.get('exercise')
    
    if exercise_name:
        # Increment the exercise counter and add exercise to the list
        exercise_counter += 1
        exercise = {
            'index': exercise_counter,
            'name': exercise_name,
            'timer': 0  # Default timer value
        }
        exercises.append(exercise)
        return jsonify({'status': 'success', 'exercise': exercise_name, 'index': exercise_counter})
    else:
        return jsonify({'status': 'error', 'message': 'Exercise name is required'})

# Route to delete an exercise
@app.route('/delete/<int:index>', methods=['DELETE'])
def delete_exercise(index):
    global exercises
    exercises = [exercise for exercise in exercises if exercise['index'] != index]
    return jsonify({'status': 'success'})

# Route to adjust the timer (add or subtract time)
@app.route('/adjust_timer', methods=['POST'])
def adjust_timer():
    data = request.get_json()
    index = data.get('index')
    change = data.get('change')
    
    # Find the exercise and update its timer
    for exercise in exercises:
        if exercise['index'] == index:
            exercise['timer'] += change
            if exercise['timer'] < 0:  # Prevent timer from going negative
                exercise['timer'] = 0
            return jsonify({'status': 'success', 'timer': exercise['timer']})
    
    return jsonify({'status': 'error', 'message': 'Exercise not found'})

# Route to get the list of exercises and their timers
@app.route('/get_exercises', methods=['GET'])
def get_exercises():
    return jsonify({'status': 'success', 'exercises': exercises})

if __name__ == '__main__':
    app.run(debug=True)
