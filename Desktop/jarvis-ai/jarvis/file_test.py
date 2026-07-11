from tools import write_file, read_file

result = write_file(
"notes.txt",
"Hello. This file was created by JARVIS."
)

print(result)

content = read_file("notes.txt")

print("\nFile Content:\n")
print(content)
