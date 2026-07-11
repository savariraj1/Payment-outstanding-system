import sys
from PyQt6.QtWidgets import QApplication
from PyQt6.QtCore import QUrl
from PyQt6.QtWebEngineWidgets import QWebEngineView

app = QApplication(sys.argv)

browser = QWebEngineView()

browser.setWindowTitle("JARVIS Browser")
browser.resize(1200, 800)

browser.load(QUrl("https://www.google.com"))

browser.show()

sys.exit(app.exec())