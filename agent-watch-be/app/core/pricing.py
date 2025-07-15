
def calculate_cost(
    tokens_prompt: int,
    tokens_completion: int,
    prompt_price: float,
    completion_price: float,
) -> float:
    return (tokens_prompt / 1000 * prompt_price) + (
        tokens_completion / 1000 * completion_price
    )
