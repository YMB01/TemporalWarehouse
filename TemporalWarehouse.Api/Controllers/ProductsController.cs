// Controllers/ProductsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourProjectNamespace.Data;
using YourProjectNamespace.Models;

namespace TemporalWarehouse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await _context.Products.Where(p => !p.IsDeleted).ToListAsync();
    }

    // POST: api/products
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        if (string.IsNullOrWhiteSpace(product.SKU))
            return BadRequest("SKU is required.");

        // Check for duplicate SKU (soft-deleted SKUs still count as duplicate)
        if (await _context.Products.AnyAsync(p => p.SKU == product.SKU))
            return Conflict("SKU must be unique.");

        _context.Products.Add(product);

        // If initial stock > 0, log it as a history event
        if (product.CurrentQuantity > 0)
        {
            _context.StockHistories.Add(new StockHistory
            {
                ProductId = product.Id, // Will be set after SaveChanges
                ChangeType = "Initial",
                QuantityChanged = product.CurrentQuantity,
                NewTotal = product.CurrentQuantity
            });
        }

        await _context.SaveChangesAsync(); // Id is now assigned

        // Fix: set ProductId in history if created above
        if (product.CurrentQuantity > 0)
        {
            var history = _context.StockHistories.First(h => h.ProductId == 0);
            history.ProductId = product.Id;
            await _context.SaveChangesAsync();
        }

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    // GET: api/products/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null || product.IsDeleted)
            return NotFound();
        return product;
    }

    // PUT: api/products/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, Product updated)
    {
        var existing = await _context.Products.FindAsync(id);
        if (existing == null || existing.IsDeleted)
            return NotFound();

        if (updated.SKU != existing.SKU &&
            await _context.Products.AnyAsync(p => p.SKU == updated.SKU && p.Id != id))
            return Conflict("SKU must be unique.");

        existing.Name = updated.Name;
        existing.SKU = updated.SKU;
        existing.Price = updated.Price;
        // Note: NOT updating CurrentQuantity here!

        try
        {
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict("Another user modified this product. Please refresh and try again.");
        }
    }

    // DELETE: api/products/5 (soft delete)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null || product.IsDeleted)
            return NotFound();

        product.IsDeleted = true;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}