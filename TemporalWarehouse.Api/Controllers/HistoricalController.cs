// Controllers/HistoricalController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourProjectNamespace.Data;

namespace TemporalWarehouse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HistoricalController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public HistoricalController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get the stock level of a product at a specific point in time.
    /// </summary>
    /// <param name="productId">ID of the product</param>
    /// <param name="at">UTC date and time to query (ISO 8601 format, e.g., 2025-12-17T10:00:00Z)</param>
    /// <returns>The stock level at that moment, or 0 if product didn't exist or had no stock</returns>
    [HttpGet("stock")]
    public async Task<ActionResult<int>> GetStockAtTime([FromQuery] int productId, [FromQuery] DateTime at)
    {
        // Step 1: Verify the product ever existed (ignore soft delete)
        bool productExists = await _context.Products
            .IgnoreQueryFilters() // Bypass IsDeleted filter if you use global query filters
            .AnyAsync(p => p.Id == productId);

        if (!productExists)
        {
            return NotFound($"Product with ID {productId} was never created.");
        }

        // Step 2: Find the most recent stock change at or before 'at'
        var latestEntry = await _context.StockHistories
            .Where(h => h.ProductId == productId && h.ChangeDate <= at)
            .OrderByDescending(h => h.ChangeDate)
            .FirstOrDefaultAsync();

        // Step 3: Return the stock level
        // - If we found a history entry → use its NewTotal
        // - If no entry exists → product existed but had no stock activity before 'at'
        //   (e.g., created with 0 stock, or 'at' is before first adjustment)
        int stockLevel = latestEntry?.NewTotal ?? 0;

        return Ok(stockLevel);
    }
}