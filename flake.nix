{
  description = "TypeScript curriculum dev shell: Node 22, Claude Code";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
      };
    in {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs_22
          biome
          git
          ripgrep
          claude-code
        ];

        shellHook = ''
          echo "node: $(node --version)"
          echo "npm:  $(npm --version)"
          echo "claude: $(claude --version 2>/dev/null || true)"
        '';
      };
    };
}
