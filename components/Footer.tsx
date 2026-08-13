export default function Footer() {
  return (
    <footer className="border-t border-paper/10 px-6 py-10 sm:px-10 md:px-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-lg text-paper">HH GOA 2026</p>
          <p className="mt-1 max-w-xs font-body text-sm text-paper/50">
            Fan-made builder identity generator for the HH Goa 2026 hackathon community.
            Not an official event product unless stated otherwise by organizers.
          </p>
        </div>
        <div className="flex gap-10 font-mono text-xs uppercase tracking-[0.14em] text-paper/50">
          <div className="flex flex-col gap-2">
            <span className="text-paper/30">Site</span>
            <a href="#create" className="hover:text-sun">Create</a>
            <a href="#how" className="hover:text-sun">How it works</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-paper/30">Coordinates</span>
            <span className="tabular-coords">15.2993 N</span>
            <span className="tabular-coords">74.1240 E</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
