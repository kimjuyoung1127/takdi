# services/
Business logic services called by API routes.

## Files
- `brief-parser.ts`: brief text parsing
- `gemini-generator.ts`: Gemini section generation
- `kie-generator.ts`: Kie image generation
- `marketing-script-generator.ts`: Gemini marketing-script generation
- `removebg-service.ts`: remove-background provider wrapper
- `bgm-analyzer.ts`: BGM analysis
- `byoi-validator.ts`: upload validation
- `section-to-blocks.ts`: section-to-block conversion
- `html-exporter.ts`: block HTML export

## Convention
- Keep provider-specific logic here, not in route handlers.
- Routes should orchestrate jobs and persistence; services should generate outputs.
