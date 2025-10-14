export default function Footer() {
  return (
    <div className="flex items-center justify-center">
      <p className="text-sm text-muted-foreground py-4">
        © {new Date().getFullYear()} TalkySpace. All rights reserved.
      </p>
    </div>
  );
}
