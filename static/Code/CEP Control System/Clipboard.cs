using Godot;
using System;

public partial class Clipboard : LineEdit
{
	string test;
	float timer = 1;
	public override void _Process(double delta)
	{
		timer -= (float)delta;
		if(timer <= 0)
		{
			timer = 0.5f;
			test = DisplayServer.ClipboardGet();
			if(test.Contains("http"))
			{
				Text = test;
			}
		}
		
	}
}
