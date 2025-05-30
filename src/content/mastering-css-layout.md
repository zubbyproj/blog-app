---
title: "Mastering Modern CSS Layout: Grid and Flexbox"
date: "2024-02-16"
excerpt: "Learn how to create powerful layouts with CSS Grid and Flexbox"
imageUrl: "/images/css-layout.jpg"
---

# Mastering Modern CSS Layout: Grid and Flexbox

Modern CSS has revolutionized how we create layouts with Grid and Flexbox. Let's explore how to use these powerful tools effectively.

## CSS Grid: Two-Dimensional Layout

CSS Grid is perfect for complex, two-dimensional layouts:

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  padding: 20px;
}

/* Responsive grid */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}
```

### Grid Areas

Name your grid areas for more intuitive layouts:

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  gap: 20px;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

## Flexbox: One-Dimensional Layout

Flexbox is ideal for one-dimensional layouts and alignment:

```css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

/* Common patterns */
.navigation {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

### Flex Growing and Shrinking

Control how items grow and shrink:

```css
.flex-item {
  flex: 1 1 auto; /* grow shrink basis */
}

.fixed-sidebar {
  flex: 0 0 250px; /* Don't grow or shrink */
}

.main-content {
  flex: 1; /* Take remaining space */
}
```

## Combining Grid and Flexbox

Use both together for powerful layouts:

```css
.page-layout {
  display: grid;
  grid-template-columns: 1fr min(65ch, 100%) 1fr;
  padding: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
```

## Best Practices

1. **Choose the Right Tool**
   - Grid for 2D layouts (rows and columns)
   - Flexbox for 1D layouts (rows OR columns)

2. **Mobile-First**
   - Start with mobile layout
   - Add complexity for larger screens
   - Use modern units (fr, ch, rem)

3. **Performance**
   - Avoid deep nesting of flex/grid containers
   - Use `will-change` sparingly
   - Consider containment for large layouts

## Real-World Example

Here's a modern card layout combining both:

```css
.cards-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  padding: 24px;
}

.card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #eee;
}
```

## Conclusion

CSS Grid and Flexbox are powerful tools that, when used together, can create virtually any layout you need. Understanding when to use each one and how to combine them will make you a more effective front-end developer. 