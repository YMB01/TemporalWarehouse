using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;
using YourProjectNamespace.Models;

namespace YourProjectNamespace.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<StockHistory> StockHistories => Set<StockHistory>();
  

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // 1. Enforce UNIQUE SKU constraint
        modelBuilder.Entity<Product>()
            .HasIndex(p => p.SKU)
            .IsUnique();

        // 2. Configure soft-delete filter (auto-ignore deleted items)
        modelBuilder.Entity<Product>()
            .HasQueryFilter(p => !p.IsDeleted);

        // 3. Configure concurrency token
        modelBuilder.Entity<Product>()
            .Property(p => p.RowVersion)
            .IsConcurrencyToken(); // Critical for race conditions
    }
}