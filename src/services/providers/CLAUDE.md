# providers/

Image generation provider abstraction layer.

## Files
- `types.ts`: Provider interface + request/result types
- `registry.ts`: Provider factory, reads `IMAGE_PROVIDER` env var
- `kie-provider.ts`: Kie.ai wrapper (Nano Banana 2 + recraft/remove-background)
- `comfyui-provider.ts`: ComfyUI local REST API provider (FLUX.1 + RMBG)
- `comfyui-workflows/`: JSON workflow templates for ComfyUI

## Convention
- All providers implement `ImageGenerationProvider` interface.
- Routes call `getProvider()` from registry — never import providers directly.
- `IMAGE_PROVIDER` env var selects active provider: `"kie"` (default) | `"comfyui"`.
- Original service files (`kie-generator.ts`, `removebg-service.ts`) are preserved for backward compatibility.
