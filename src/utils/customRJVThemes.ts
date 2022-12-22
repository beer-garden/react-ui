// modified RJV themes to be WCAG AA contrast compliant (>4.5:1 against base00)
// baseBG is hex code for theme's background color
export const lightTheme = (baseBG: string) => {
  return {
    base00: baseBG, // background
    base01: baseBG, // validation fail icon/font, edit background
    base02: baseBG, // boarder, type background
    base03: '#6B7979',
    base04: '#000000', // object size
    base05: '#586E75', // undefined, add background
    base06: '#073642',
    base07: '#004D61', // brace, key ('root') color
    base08: '#CD2D7A', // NAN
    base09: '#C54816', // ellipsis, string, validation failure bg
    base0A: '#D92926', // null, regexp
    base0B: '#607000', // float
    base0C: '#6266C0', // array key color
    base0D: '#586E75', // expanded icon, date, fn
    base0E: '#0D7D76', // collapsed icon , boolean, int
    base0F: '#0074C7', // clipboard
  }
}

export const darkTheme = (baseBG: string) => {
  return {
    base00: baseBG,
    base01: baseBG,
    base02: baseBG,
    base03: '#B0B0B0',
    base04: '#D0D0D0',
    base05: '#E0E0E0',
    base06: '#F5F5F5',
    base07: '#FFFFFF',
    base08: '#FF9AA5',
    base09: '#FF8D4D',
    base0A: '#FDA331',
    base0B: '#A1C659',
    base0C: '#76C7B7',
    base0D: '#6FB3D2',
    base0E: '#DD92CF',
    base0F: '#EA9671',
  }
}
