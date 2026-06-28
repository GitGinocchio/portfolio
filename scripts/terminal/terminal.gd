extends TerminalBase

func _ready() -> void:
	setup_highlighter()
	terminal_println()
	terminal_println("""Hi user! type "help" to get a list of all available commands""")
	terminal_print(get_prompt())

func _input(event: InputEvent) -> void:
	if event is not InputEventKey or not event.pressed:
		return
	
	if event.keycode == KEY_UP:
		get_viewport().set_input_as_handled()
	if event.keycode == KEY_DOWN:
		get_viewport().set_input_as_handled()
	elif event.keycode == KEY_BACKSPACE:
		if current_command.length() > 0:
			var last_char_position = current_command.length() - 1
			current_command = current_command.left(last_char_position)
		terminal_erase()
	elif event.keycode == KEY_ENTER:
		handle_command(current_command)
		terminal_println()
		terminal_print(get_prompt())
		command_clear()
	elif is_valid_char(event):
		command_push(char(event.unicode))
