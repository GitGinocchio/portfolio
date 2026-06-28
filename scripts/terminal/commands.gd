class_name Commands

var terminal: TerminalBase
func _init(terminal_ref: TerminalBase):
	terminal = terminal_ref

var commands: Dictionary[String, Callable] = {
	"help" : help,
	"clear" : clear,
	"echo" : echo
}

func execute(command: String):
	var parts = command.strip_edges().split(" ")
	var cmd = parts[0]
	var args = parts.slice(1)
	
	if cmd == '': return
	elif commands.has(cmd):
		terminal.terminal_println()
		commands[cmd].call(args)
	else:
		terminal.terminal_println()
		terminal.terminal_println("Error: command '" + cmd + "' is not a valid command")
	
# Commands

func help(args: Array[String]):
	terminal.terminal_println("Here is a list of all available commands:")
	for cmd in commands.keys():
		terminal.terminal_println("- "+cmd)

func clear(args: Array[String]):
	terminal.terminal_clear()

func echo(args: Array[String]):
	var printable = " ".join(args)
	
	if printable.begins_with('"') and printable.ends_with('"'):
		printable = printable.substr(1, printable.length() - 2)
	elif printable.begins_with('\'') and printable.ends_with('\''):
		printable = printable.substr(1, printable.length() - 2)
	
	terminal.terminal_println(printable)
