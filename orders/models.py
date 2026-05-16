from django.db import models

# Create your models here.
from django.db import models

class Order(models.Model):
    name = models.CharField(max_length=100)
    items = models.JSONField()
    total = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - ₹{self.total}"