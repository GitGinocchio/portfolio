extends CodeEdit
class_name TerminalBase

@onready var font = get_theme_font("font")
@onready var font_size = get_theme_font_size("font_size")
@onready var CommandsManager = preload("res://scripts/terminal/commands.gd").new(self)

static var user = "player"
static var hostname = "debian"
static var current_dir = "~"
static var is_root = false
static var current_command = ""

func setup_highlighter():
	var highlighter = CodeHighlighter.new()
	highlighter.number_color = Color.WHITE
	highlighter.symbol_color = Color.WHITE
	highlighter.member_variable_color = Color.WHITE
	highlighter.add_color_region('"', '"', Color.SALMON, false)
	highlighter.add_keyword_color(get_prompt(), Color.CORAL)
	
	for cmd in CommandsManager.commands.keys():
		highlighter.add_keyword_color(cmd, Color.YELLOW)
		
	self.syntax_highlighter = highlighter
	self.text_changed.emit()
	self.queue_redraw()

static func get_prompt() -> String:
	var symbol = "#" if is_root else "$"
	return user + "@" + hostname + ":" + current_dir + symbol + " "

func scroll_to_bottom():
	var v_scroll = self.get_v_scroll_bar()
	var line_height = font.get_height(font_size)
	v_scroll.value = v_scroll.max_value + line_height

func is_valid_char(event: InputEvent):
	if event is InputEventKey and event.pressed:
		if event.unicode > 0:
			var character = char(event.unicode)
			
			if character.is_valid_int():
				return true # Numero
			elif character.is_valid_identifier():
				return true # lettera
			else:
				return true # simbolo
	return false

func terminal_clear():
	self.current_command = ""
	self.text = ""

func terminal_erase():
	var last_line_index = self.get_line_count() - 1
	var current_text = self.get_line(last_line_index)
	var prompt = get_prompt()
	
	if current_text.length() > prompt.length():
		var new_text = current_text.substr(0, current_text.length() - 1)
		self.set_line(last_line_index, new_text)
		self.set_caret_column(new_text.length())

func terminal_print(message: String):
	var last_line_index = self.get_line_count() - 1
	var current_text = self.get_line(last_line_index)
	self.set_line(last_line_index, current_text + message)
	
	var new_length = self.get_line(last_line_index).length()
	self.set_caret_line(last_line_index)
	self.set_caret_column(new_length)

func terminal_println(message: String = ""):
	self.terminal_print(message)
	self.terminal_print("\n")
	self.scroll_to_bottom()

func command_push(character: String):
	current_command += character
	terminal_print(character)

func command_clear():
	current_command = ""

func handle_command(command: String):
	CommandsManager.execute(command)
