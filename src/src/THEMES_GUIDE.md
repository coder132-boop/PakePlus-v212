# ChoreCore Themes Guide

## Available Themes

ChoreCore now includes **9 beautiful themes** - 6 static themes and 3 animated themes!

### 🎨 Classic Themes (Static)

These themes have fixed colors that don't change:

1. **Light** ☀️
   - Clean and bright
   - Perfect for daytime use
   - Default theme

2. **Dark** 🌙
   - Easy on the eyes
   - Great for nighttime or low-light environments
   - Reduces eye strain

3. **Ocean** 🌊
   - Cool blues and cyans
   - Calming and peaceful
   - Perfect for a serene vibe

4. **Sunset** 🌅
   - Warm oranges and pinks
   - Vibrant and energetic
   - Cozy and inviting

5. **Forest** 🌲
   - Natural greens
   - Fresh and earthy
   - Brings nature indoors

6. **Lavender** 💜
   - Soft purples and pinks
   - Elegant and sophisticated
   - Gentle on the eyes

---

### ✨ Animated Themes (Dynamic Color-Changing)

These themes have colors that smoothly change over time, creating a mesmerizing effect:

7. **Rainbow** 🌈
   - Ever-changing rainbow colors
   - Cycles through the full spectrum
   - Fun and playful
   - Colors change every few seconds

8. **Aurora** 🌌
   - Northern lights effect
   - Shifting greens, blues, and purples
   - Mystical and ethereal
   - Smooth, flowing color transitions

9. **Cosmic** 🪐
   - Deep space vibes
   - Dark background with shifting purples, pinks, and cyans
   - Perfect for space lovers
   - Dramatic and otherworldly

---

## How to Change Themes

### From the Settings Page

1. Go to **Dashboard**
2. Click the **⚙️ Settings** button
3. Scroll to the **Theme** section
4. Click on any theme to activate it

Your theme choice is automatically saved and will persist across sessions!

---

## Theme Features

### All Themes Include:
- ✅ **Liquid Glass aesthetic** - Frosted glass panels with backdrop blur
- ✅ **Consistent UI** - All components adapt to the theme
- ✅ **Auto-save** - Your choice is remembered
- ✅ **Smooth transitions** - Colors change gracefully
- ✅ **Full coverage** - Every page respects your theme

### Animated Themes Extra Features:
- 🎨 **Real-time color changes** - Colors smoothly animate
- ⚡ **Performance optimized** - Uses requestAnimationFrame
- 🔄 **Infinite loop** - Never stops changing
- 💫 **Unique patterns** - Each theme has its own animation style

---

## Technical Details

### Browser Compatibility
- ✅ Works on all modern browsers
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Mobile and desktop
- ✅ Uses CSS custom properties

### Performance
- Animated themes use efficient requestAnimationFrame
- Minimal CPU/battery impact
- Colors update at 60fps when active
- Animation stops when you switch to static themes

### How Animation Works
The animated themes use JavaScript to smoothly change CSS custom properties over time:
- **Rainbow**: Linear hue rotation through the color spectrum
- **Aurora**: Sinusoidal color shifts mimicking northern lights
- **Cosmic**: Slow, deep space-inspired color transitions

---

## Tips & Recommendations

### For Best Experience:
- 📱 **On Mobile**: Static themes save battery
- 💻 **On Desktop**: Try animated themes for eye candy
- 🌙 **Night Mode**: Use Dark, Aurora, or Cosmic
- ☀️ **Day Mode**: Use Light, Ocean, or Sunset
- 🎨 **Creative Work**: Try Rainbow for inspiration
- 🧘 **Relaxation**: Ocean or Forest are calming

### Battery Considerations:
- Static themes use **zero** extra battery
- Animated themes use minimal battery (~1-2% more)
- On battery power? Consider static themes

---

## Accessibility

All themes maintain proper contrast ratios for readability:
- Text is always clearly visible
- Buttons have proper contrast
- Focus states are visible
- Color is not the only indicator of state

---

## Customization

Want to create your own theme? The theme system is built with CSS custom properties. You can:
1. Add a new theme class in `/styles/globals.css`
2. Update the theme type in `/contexts/ThemeContext.tsx`
3. Add it to the theme selector in `/components/SettingsPage.tsx`

---

## Future Themes (Ideas)

Vote for what you'd like to see next:
- 🔥 **Fire** - Warm reds and oranges with flickering effect
- ❄️ **Ice** - Cool blues and whites with crystalline feel
- 🌸 **Sakura** - Soft pinks with falling petals animation
- 🌙 **Moonlight** - Silver and blue night theme
- 🍂 **Autumn** - Rich browns, oranges, and golds
- 🌺 **Tropical** - Vibrant greens and exotic colors

---

## Troubleshooting

**Theme not applying?**
- Refresh the page
- Check browser console for errors
- Try switching to Light theme first, then your preferred theme

**Animation stuttering?**
- Close other tabs to free up resources
- Try a static theme if performance is an issue
- Animated themes work best on modern devices

**Colors look wrong?**
- Check your browser supports CSS custom properties
- Try a different browser
- Update your browser to the latest version

---

## Summary

🎨 **9 total themes** - Something for everyone!
✨ **3 animated** - Rainbow, Aurora, Cosmic
🎯 **6 classic** - Light, Dark, Ocean, Sunset, Forest, Lavender
💾 **Auto-saved** - Your choice is remembered
🔄 **Live updates** - Switch anytime, no refresh needed

Enjoy your personalized ChoreCore experience! 🎉
