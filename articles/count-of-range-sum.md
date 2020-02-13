# Count of range sum

__Problem:__ Given an integer array nums, return the number of range sums that lie in [lower, upper] inclusive.
Range sum `S(i, j)` is defined as the sum of the elements in nums between indices `i` and `j` `(i ≤ j)`, inclusive.

__Note:__

This is a popular problem on _LeetCode_. For this problem, the solution differs between positive integer only case and general case. The former case is solvable in `O(n)` while the latter can only be solved in `O(nlogn)`.

__Example:__

```
Input: nums = [-2,5,-1], lower = -2, upper = 2,
Output: 3 
Explanation: The three ranges are : [0,0], [2,2], [0,2] and their respective sums are: -2, -1, 2.
```

## Positive only case

```python
from typing import List

class Solution:
    def countRangeSum(self, nums: List[int], lower: int, upper: int) -> int:
        if not nums:
            return 0
        sm = [0]
        for ele in nums:
            sm.append(sm[-1]+ele)
        n = len(sm)
        
        def mergeSort(lo, hi):
            if lo == hi:
                return 0
            mi = (lo+hi) // 2
            count = mergeSort(lo, mi) + mergeSort(mi+1, hi)
            l = r = mi+1
            for i in range(lo, mi+1):
                while l < hi+1 and sm[l] - sm[i] < lower:
                    l += 1
                while r < hi+1 and sm[r] - sm[i] <= upper:
                    r += 1
                count += r-l
                
            # merge
            tmp = []
            j = lo
            for i in range(mi+1, hi+1):
                while j < mi+1 and sm[j] < sm[i]:
                    tmp.append(sm[j])
                    j += 1
                tmp.append(sm[i])
            tmp += sm[j: mi+1]            
            sm[lo:hi+1] = tmp
            return count
        count = mergeSort(0,n-1)
        return count
```

## General case

Here is the code:

```
```