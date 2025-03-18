from flask import Flask, render_template_string

app = Flask("daq")


@app.route('/')
def index():
    return render_template_string("""
        <html>
            <head>
                <title>
                    Data Display
                </title>
            </head>
            <body>
                <h1>Sensor Data</h1>
                <p>Temperature</p>
            </body>
        </html>
    """)


app.run(host="0.0.0.0", port=5002)