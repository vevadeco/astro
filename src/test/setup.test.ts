import { describe, it, expect } from 'vitest'

describe('Project setup', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true)
  })

  it('should have fast-check available', async () => {
    const fc = await import('fast-check')
    expect(fc.assert).toBeDefined()
  })
})
