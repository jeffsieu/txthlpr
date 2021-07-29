# txthlpr

[![Deploy to github pages](https://github.com/jeffsieu/txthlpr/actions/workflows/deploy.yml/badge.svg)](https://github.com/jeffsieu/txthlpr/actions/workflows/deploy.yml)

[View here](https://jeffsieu.github.io/txthlpr/)

## Motivation

Sometimes I have a block of text. And I need to format it using some kind of repetitive action.
And I wish there was a tool to help me do this, without actually need to use some complicated regex or otherwise,
that just takes more time than manually doing it by hand in the first place.

A tool that can do a certain operation for each line of text, for example.

Like this yaml from [here](https://github.com/ahmadawais/base16-shades-of-purple/blob/master/shades-of-purple.yaml)
that I had to manually edit while making this very tool:

```yaml
base00: "1e1e3f" # default background
base01: "43d426" # lighter background (status bar)
base02: "f1d000" # selection background
base03: "808080" # comments, invisibles
base04: "6871ff" # dark foreground (status bar)
base05: "c7c7c7" # default foreground
base06: "ff77ff" # light foreground
base07: "ffffff" # light background
base08: "d90429" # variables
base09: "f92a1c" # constants
base0A: "ffe700" # search text background
base0B: "3ad900" # strings
base0C: "00c5c7" # regex, escaped chars
base0D: "6943ff" # functions
base0E: "ff2c70" # keywords
base0F: "79e8fb" # deprecations
```

to

```js
{
  base00: "1e1e3f",
  base01: "43d426",
  base02: "f1d000",
  base03: "808080",
  base04: "6871ff",
  base05: "c7c7c7",
  base06: "ff77ff",
  base07: "ffffff",
  base08: "d90429",
  base09: "f92a1c",
  base0A: "ffe700",
  base0B: "3ad900",
  base0C: "00c5c7",
  base0D: "6943ff",
  base0E: "ff2c70",
  base0F: "79e8fb",
}
```

Basically:

1. Remove the comments (everything after `#`)
2. Add a comma after every line

But I want to do this without manually selecting the text with my cursor on every line.

Now I can!

1. Paste in text
2. Use `split` with delimiter `\n`
3. Replace all occurrences of `" #"` with an empty string `""`
4. Type in the last comma yourself. (Data is automatically converted back into a string whenever you type,)
5. Copy out this result, and manually add in the braces as required.
    ```
    base00: "1e1e3f",
    base01: "43d426",
    base02: "f1d000",
    base03: "808080",
    base04: "6871ff",
    base05: "c7c7c7",
    base06: "ff77ff",
    base07: "ffffff",
    base08: "d90429",
    base09: "f92a1c",
    base0A: "ffe700",
    base0B: "3ad900",
    base0C: "00c5c7",
    base0D: "6943ff",
    base0E: "ff2c70",
    base0F: "79e8fb",
    ```

> Note: The main purpose of this tool is to cut down on such repetitiveness in the fastest way possible.
  As such, it may not be as flexible, as seen in steps 4 and 5 where manual work is done.
  In any case, it's always faster to manually edit these things yourself, rather than create an option
  in the tool to support such edge cases.
