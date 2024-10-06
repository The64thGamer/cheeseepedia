using Godot;
using System;
using System.Linq;

public partial class AddVideo : Button
{
	[Export] LineEdit link;
	[Export] LineEdit date;
	[Export] TextEdit description;
	[Export] LineEdit categories;
	[Export] LineEdit pages;
	
	public override void _Ready()
	{
		Pressed += () => AddVideoFile();
	}

	void AddVideoFile()
	{
		string html = "+++";
		html += "\n" + "title = \"" + link.Text + "\"";
		html += "\n" + "tags = [\"Videos\"]";
		html += "\n" + "categories = [";
		string[] catsplit = categories.Text.Split(", ");
		for (int i = 0; i < catsplit.Length; i++)
		{
			html += "\"" + catsplit[i] + "\"";
			if(i != catsplit.Length-1)
			{
				html += ", ";
			}
		}
		html += "]";
		html += "\n" + "date = \"" + date.Text + "\"";
		html += "\n" + "draft = false";
		html += "\n" + "pages = [";
		string[] pagesplit = pages.Text.Split(", ");
		for (int i = 0; i < pagesplit.Length; i++)
		{
			html += "\"" + pagesplit[i] + "\"";
			if(i != pagesplit.Length-1)
			{
				html += ", ";
			}
		}
		html += "]";
		html += "\n" + "description = \"" + description.Text + "\"";
		html += "\n" + "sources = []";
		html += "\n" + "mirroredLinks = []";
		html += "\n" + "+++";

		DirAccess dir = DirAccess.Open("res://../../../");
		if(dir.GetDirectories().Contains("content"))
		{
			var fileAcess = FileAccess.Open("res://../../../content/videos/" + GenerateWord(25) + ".html", FileAccess.ModeFlags.Write);
			fileAcess.StoreString(html);
			fileAcess.Close();
		}
	}

	string alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_";

	string GenerateWord(int length)
    {
        Random random = new Random();
        string word = "";

        for (int i = 0; i < length; i++)
        {
            int index = random.Next(alphabet.Length);
            word += alphabet[index];
        }

        return word;
    }
}