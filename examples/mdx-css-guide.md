# MDX & CSS Guide för idag.ai

## Översikt av mallar

Vi har skapat fyra specialiserade MDX-mallar för våra kategorier:

- **📰 Nyheter** (`mall-nyheter.mdx`) - Breaking news, analyser, branschuppdateringar
- **🤖 Modeller** (`mall-modeller.mdx`) - AI-modellrecensioner, jämförelser, guider  
- **🛠️ Verktyg** (`mall-verktyg.mdx`) - Verktygsrecensioner, tutorials, jämförelser
- **🎓 Akademi** (`mall-akademi.mdx`) - Utbildningsinnehåll, guider, kurser

## CSS-variabler och klasser

### Färgschema (Apple-inspirerat)

```css
/* Primära färger */
--color-primary: #1d1d1f        /* Huvudtext */
--color-secondary: #86868b      /* Sekundär text */
--color-accent: #0071e3         /* Accent/länkar */
--color-success: #30d158        /* Framgång/positiv */
--color-warning: #ff9500        /* Varning/uppmärksamhet */
--color-error: #ff3b30          /* Fel/negativ */

/* Bakgrunder */
--color-background: #ffffff     /* Huvudbakgrund */
--color-surface: #fbfbfd        /* Kort/ytor */
--color-tertiary: #f5f5f7       /* Ljus bakgrund */
```

### Typografi-klasser

```css
.typography-hero      /* Stora rubriker */
.typography-h1        /* H1 rubriker */
.typography-h2        /* H2 rubriker */
.typography-h3        /* H3 rubriker */
.typography-body      /* Brödtext */
.typography-caption   /* Bildtexter */
.typography-small     /* Liten text */
```

### Layout-klasser

```css
.container            /* Huvudcontainer med max-width */
.section              /* Sektioner med padding */
.section--hero        /* Hero-sektioner */
.news-grid            /* Responsivt grid */
.news-grid--three-columns  /* 3-kolumns grid */
.news-card            /* Kort med hover-effekter */
```

### Spacing-system

```css
--spacing-xs: 0.5rem    /* 8px */
--spacing-sm: 1rem      /* 16px */
--spacing-md: 1.5rem    /* 24px */
--spacing-lg: 2rem      /* 32px */
--spacing-xl: 3rem      /* 48px */
--spacing-2xl: 4rem     /* 64px */
--spacing-3xl: 6rem     /* 96px */
```

## MDX-komponenter och tekniker

### 1. Hero-sektioner

```jsx
<div className="section section--hero" style={{
  background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)',
  color: 'white',
  textAlign: 'center'
}}>
  <div className="container">
    <h1 className="typography-hero" style={{ color: 'white' }}>
      Din rubrik här
    </h1>
  </div>
</div>
```

### 2. Informationskort

```jsx
<div className="news-grid news-grid--three-columns">
  <div className="news-card" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
    <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>⚡</div>
    <h3 className="typography-h3" style={{ color: 'var(--color-accent)' }}>Titel</h3>
    <p className="typography-body">Beskrivning här</p>
  </div>
</div>
```

### 3. Highlight-boxar

```jsx
{/* Framhävd information */}
<div style={{
  background: 'var(--color-accent)',
  color: 'white',
  padding: 'var(--spacing-lg)',
  borderRadius: 'var(--border-radius-lg)',
  margin: 'var(--spacing-lg) 0'
}}>
  <h3 className="typography-h3" style={{ color: 'white' }}>Viktig information</h3>
  <p>Din text här</p>
</div>
```

### 4. Varningsboxar

```jsx
{/* Varning eller uppmärksamhet */}
<div style={{
  background: 'var(--color-warning)',
  color: 'white',
  padding: 'var(--spacing-md)',
  borderRadius: 'var(--border-radius)',
  margin: 'var(--spacing-lg) 0'
}}>
  <h4 className="typography-h3" style={{ color: 'white' }}>⚠️ Viktigt att veta</h4>
  <ul style={{ margin: 0, paddingLeft: 'var(--spacing-md)' }}>
    <li>Punkt 1</li>
    <li>Punkt 2</li>
  </ul>
</div>
```

### 5. Citat/Blockquotes

```jsx
<blockquote style={{
  borderLeft: '4px solid var(--color-accent)',
  paddingLeft: 'var(--spacing-md)',
  margin: 'var(--spacing-lg) 0',
  fontStyle: 'italic',
  background: 'var(--color-surface)',
  padding: 'var(--spacing-md)',
  borderRadius: 'var(--border-radius)'
}}>
  <p className="typography-h3">Din citat här</p>
  <footer className="typography-caption">— Källa</footer>
</blockquote>
```

### 6. Tabeller

```jsx
<div style={{ overflow: 'auto' }}>
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
        <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left' }}>Kolumn 1</th>
        <th style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}>Kolumn 2</th>
      </tr>
    </thead>
    <tbody>
      <tr style={{ background: 'var(--color-accent)', color: 'white' }}>
        <td style={{ padding: 'var(--spacing-sm)' }}>Data 1</td>
        <td style={{ padding: 'var(--spacing-sm)', textAlign: 'center' }}>Data 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 7. Prissättningskort

```jsx
<div className="news-grid news-grid--three-columns">
  <div className="news-card" style={{ border: '2px solid var(--color-accent)' }}>
    <div style={{ 
      background: 'var(--color-accent)', 
      color: 'white', 
      padding: 'var(--spacing-sm)', 
      textAlign: 'center'
    }}>
      POPULÄRAST
    </div>
    <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
      <h4 className="typography-h2">Pro</h4>
      <div style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-bold)' }}>
        200 SEK<span style={{ fontSize: '1rem' }}>/månad</span>
      </div>
    </div>
  </div>
</div>
```

### 8. Betyg och recensioner

```jsx
<div style={{
  background: 'var(--color-accent)',
  color: 'white',
  padding: 'var(--spacing-xl)',
  borderRadius: 'var(--border-radius-lg)',
  textAlign: 'center'
}}>
  <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>9.1</div>
  <h3 className="typography-h2" style={{ color: 'white' }}>Utmärkt</h3>
  <p style={{ color: 'rgba(255,255,255,0.9)' }}>Beskrivning av betyget</p>
</div>
```

## Responsiv design

Alla komponenter är responsiva tack vare:

- `clamp()` för typografi som anpassar sig
- Flexbox och Grid för layout
- CSS-variabler för konsekvent spacing
- Mobile-first approach

## Bästa praxis

### 1. Konsekvent färganvändning
- Använd CSS-variabler istället för hårdkodade färger
- Följ färgschemat för olika typer av innehåll

### 2. Spacing
- Använd spacing-variablerna för konsekvent avstånd
- Undvik hårdkodade pixelvärden

### 3. Typografi
- Använd de definierade typografi-klasserna
- Anpassa färger med inline styles när nödvändigt

### 4. Tillgänglighet
- Säkerställ tillräcklig kontrast
- Använd semantiska HTML-element
- Inkludera alt-text för bilder

## Exempel på kategori-specifika element

### Nyheter
- Breaking news badges
- Tidsstämplar
- Källhänvisningar
- Relaterade artiklar

### Modeller
- Specifikationstabeller
- Jämförelsematriser
- Betygsystem
- Kapacitetsindikatorer

### Verktyg
- Funktionslistor
- Prissättningsjämförelser
- Installationsguider
- Pro/cons-listor

### Akademi
- Lärvägsindikatorer
- Övningsboxar
- Resurslänkar
- Svårighetsgrader

Denna guide ger dig alla verktyg för att skapa engagerande och visuellt tilltalande innehåll som följer idag.ai:s designsystem!