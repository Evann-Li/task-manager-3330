import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: () => (
    <div className="p-2">
      <h3>Keep your to-do list organized and stay on top of your day with our task manager app. Create tasks, set how long each one will take, delete them when you're finished, and get a clear view of what’s ahead. It’s a straightforward way to manage your time without overcomplicating things. Perfect for keeping life a little more manageable.</h3>
    </div>
  ),
});
