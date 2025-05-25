# Converting FoodConnect to a Native App - Implementation Guide

## Overview

This document provides guidance on converting the FoodConnect web application to a native mobile app using React Native. The conversion process should maintain the same functionality while optimizing for mobile platforms.

## Architecture Changes

### 1. Navigation

- The `next/router` or `next/navigation` is replaced with React Navigation.
- File-based routing is replaced with explicit navigation configuration.

### 2. UI Components

- Replace all web components (divs, spans, etc.) with React Native components (View, Text, etc.)
- Use React Native specific component libraries or custom components instead of shadcn/ui
- Use React Native StyleSheet instead of Tailwind CSS

### 3. Data Storage

- Replace browser localStorage with AsyncStorage
- API calls remain similar but may need adjustments for mobile networks

### 4. Styling Approach

- Convert all Tailwind classes to React Native StyleSheet objects
- Handle responsive layouts using React Native Dimensions and FlexBox

## Component Conversion Examples

### Original Web Component:
\`\`\`jsx
<Card className="border-t-4 border-t-primary hover:shadow-md transition-all duration-300">
  <CardHeader>
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
      <Utensils className="h-6 w-6 text-primary" />
    </div>
    <CardTitle>Wide Selection</CardTitle>
    <CardDescription>Choose from hundreds of restaurants and cuisines in your area</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">
      From local favorites to international cuisines, we've got all your cravings covered.
    </p>
  </CardContent>
</Card>
