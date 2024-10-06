using Godot;
using System;

public partial class Clipboard : LineEdit
{
	string test;
	public override void _Process(double delta)
	{
		test = DisplayServer.ClipboardGet();
		if(test.Contains("http"))
		{
			Text = test;
		}
	}
}
