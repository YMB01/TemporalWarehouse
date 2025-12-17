// Controllers/StockController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourProjectNamespace.Data;
using YourProjectNamespace.Models;

namespace TemporalWarehouse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StockController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StockController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddStock([FromBody] StockAdjustmentDto dto)
    {
        if (dto.Quantity <= 0)
            return BadRequest("Quantity must be positive.");

        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == dto.ProductId && !p.IsDeleted);

        if (product == null)
            return NotFound("Product not found.");

        // Wrap in transaction for consistency
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Optimistic concurrency: EF tracks RowVersion
            product.CurrentQuantity += dto.Quantity;

            _context.StockHistories.Add(new StockHistory
            {
                ProductId = dto.ProductId,
                ChangeType = "Add",
                QuantityChanged = dto.Quantity,
                NewTotal = product.CurrentQuantity
            });

            await _context.SaveChangesAsync(); // Throws if RowVersion changed
            await transaction.CommitAsync();
            return Ok(new { product.Id, product.CurrentQuantity });
        }
        catch (DbUpdateConcurrencyException)
        {
            await transaction.RollbackAsync();
            return Conflict("Concurrent modification detected. Please retry.");
        }
    }

    [HttpPost("remove")]
    public async Task<IActionResult> RemoveStock([FromBody] StockAdjustmentDto dto)
    {
        if (dto.Quantity <= 0)
            return BadRequest("Quantity must be positive.");

        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == dto.ProductId && !p.IsDeleted);

        if (product == null)
            return NotFound("Product not found.");

        if (product.CurrentQuantity < dto.Quantity)
            return BadRequest("Insufficient stock. Cannot go below zero.");

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            product.CurrentQuantity -= dto.Quantity;

            _context.StockHistories.Add(new StockHistory
            {
                ProductId = dto.ProductId,
                ChangeType = "Remove",
                QuantityChanged = dto.Quantity,
                NewTotal = product.CurrentQuantity
            });

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return Ok(new { product.Id, product.CurrentQuantity });
        }
        catch (DbUpdateConcurrencyException)
        {
            await transaction.RollbackAsync();
            return Conflict("Concurrent modification detected. Please retry.");
        }
    }
}

// DTO for clean input
public class StockAdjustmentDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}