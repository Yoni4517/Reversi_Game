// template <class T>//0
// T* data //3
// T& ....//11
// void insert (T)//14
// T delLast()//16


int size();
int List::size() const
{
    int sum=0;
    for(Link* p=head;p!=nullptr;p=p->next, sum++);
    return sum;
}

void List:: removeAll((bool)(*func)(int))
{
    if(isEmpty) return;
    Link* q=head, p=head->next;
    if(func(q->value)){
        removeFirst();
    }
    for(q=head, p=head->next ;*p!=null;p=p->next,q=q->next)
    {
        if(func(p->value)){
            q->next=p->next;
            delete p;
            p=q->next;
        }
    }
}