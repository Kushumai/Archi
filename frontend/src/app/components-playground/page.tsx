import { Button } from "@/components/atoms/Button";

export default function Home() {
  return (
    <div className="">
      <h1 className="text-5xl font-bold mb-6">Test Buttons 🎨</h1>

      <Button>Primary (default)</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>

      <div className="mt-6 flex space-x-2">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>
  );
}